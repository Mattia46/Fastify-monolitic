'use strict'

module.exports = async function (fastify, opts) {
  const { mongo } = fastify;
  const postCol = mongo.db.collection('post')
  const usersCol = mongo.db.collection('users')

  //fastify.addHook('preHandler', fastify.basicAuth)

  fastify.route({
    method: 'GET',
    url: '/:username/post',
    schema: {
      description: 'Get post created by the user',
      params: 'username#',
      response: {
        200: {
          type: 'array',
          items: 'post-response#'
        }
      }
    },
    handler: onGetPost
  })

  fastify.route({
    method: 'GET',
    url: '/users',
    schema: {
      description: 'Get a post by its id',
      //params: 'username#',
      response: {
        200: {
          type: 'array',
          items: 'get-users#'
        }
      }
    },
    handler: onGetUsers
  })

  fastify.route({
    method: 'GET',
    url: '/users/:username',
    schema: {
      description: 'Get a post by its id',
      params: 'username#',
      response: {
        200: 'get-users#'
      }
    },
    handler: onGetUser
  })

  async function onGetUsers (req, res) {
    const user = await usersCol.find().toArray()
    return user
  }

  async function onGetUser (req, res) {
    const { username } = req.params
    const posts = await postCol.find({author: username}).toArray()
    await usersCol.update(
      {username: username},
      { $set: { post: posts } }
    )
    const user = await usersCol.findOne({username})
    return user
  }

  async function onGetPost (req, reply) {
    return postCol
      .find({ author: req.params.username })
      .toArray()
  }
}

//module.exports.autoPrefix = '/user'
