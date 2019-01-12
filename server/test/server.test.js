const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers}  = require('./seed/seed.js');
beforeEach(populateTodos);
beforeEach(populateUsers);
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
    .get('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  });
});

describe('GET/todos/:id',()=>{
    it('should return todos doc',(done)=>{
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });
    it('should not return todos doc created by second user',(done)=>{
      request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('Should return code 404 if todo not found',(done)=>{
          var hexId = new ObjectID().toHexString(); 
          request(app)
          .get(`/todos/${hexId}`)
          .set('x-auth',users[0].tokens[0].token)
          .expect(404)
          .expect((res)=>{
            expect(res.body.todo).toBeFalsy();
          }).end(done);
    });
    it('Should return 404 for invalid id',(done)=>{
      request(app)
      .get('/todos/1234567890')
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .expect((res)=>{
        expect(res.body.todo).toBeFalsy();
      }).end(done);
    });
});

describe('DLELTE /todos/:id',()=>{
    it('Should remove a todo',(done)=>{
        request(app)
        .delete(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{
          expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
        }).end((err,res)=>{
            if(err){
              return done(err);
            }
            Todo.findById(todos[1]._id.toHexString()).then((todos)=>{
                expect(todos).toBeFalsy();
                done();
            }).catch((e)=>done(e));
        });
    });
    it('Should not let auauthenticated user delete todo',(done)=>{
        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end((err,res)=>{
            if(err){
              return done(err);
            }
            Todo.findById(todos[0]._id.toHexString()).then((todos)=>{
                expect(todos).toBeTruthy();
                done();
            }).catch((e)=>done(e));
        });
    });
    it('should return 404 if todo not found',(done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .expect((res)=>{
          expect(res.body.todo).toBeFalsy();
        }).end(done);
    });
    it('should return 404 if object ID is invalid',(done)=>{
        const Todo_bef = Todo;
        request(app)
        .delete('/todos/1234')
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .expect((res)=>{
          expect(res.body.todo).toBeFalsy();
        }).end(()=>{
            expect(Todo).toBe(Todo_bef);
            done();
        });
    });
});


describe('PATCH /todos/:id',()=>{
  var text = "new text to be updated";
  it('should update the todo',(done)=>{
      request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({completed:true,
        text})
      .expect(200)
      .expect((res)=>{
          expect(typeof res.body.todo.completedAt).toBe('number'); 
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.text).toBe(text);
      }).end(done);
  });
  it('should not let unauthorised user update todo',(done)=>{
      request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({completed:true,
        text})
      .expect(404)
      .end(done);
  });
  it('should update the todo to remove the completed at',(done)=>{
      request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({completed:false})
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      }).end(done);
  });
});

describe('GET /users/me',()=>{
  it('should return user if authenticated',(done)=>{
    // console.log(users[0].tokens[0].token);

    request(app)
    .get('/users/me')
    .set({'x-auth':users[0].tokens[0].token})
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);
  });
  it('should return 401 if not authentiacted',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    }).end(done);
  });
});

describe('POST/users',()=>{
  it('should create a user',(done)=>{
    var email = "example@test.com";
    var password = "123rtff";
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.body.email).toBe(email);
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
    }).end((err)=>{
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      }).catch((e)=>done(e));

    });
  });
  it('should return a error for pass<6',(done)=>{
    var email = "invalid";
    var password = "ival";
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .expect((res)=>{
      expect(res.body._id).toBeFalsy();
      expect(res.body.email).toBeFalsy();
    }).end(done);
  });
  it('DUplicate email',(done)=>{
    var email  = "andrew@example.com";
    var password = "asdfgbvc";
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .expect((res)=>{
       expect(res.body._id).toBeFalsy();   
    }).end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(401)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('DELETE /user/me/token',()=>{
  it('should remove auth token on logout',(done)=>{

    request(app)
    .delete('/users/me/token')
    .set({'x-auth':users[0].tokens[0].token})
    .expect(200).end((err,res)=>{
      if(err)
      {
        return done(err);
      }
      User.findOne({email:users[0].email}).then((user)=>{
        expect(user.tokens.token).toBeFalsy();
        done();
      });
    });
  });
});