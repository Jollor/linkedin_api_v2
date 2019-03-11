'use strict';

const request = require('request');

/*
 * A simple, stateless client for interacting with v2 version of LinkedIn API.
 * API reference: https://developer.linkedin.com/docs/guide/v2.
 */
module.exports = class LinkedinClient {

  static get baseUrl() {
    return 'https://api.linkedin.com';
  }

  static get baseMediaUrl() {
    return 'https://media.licdn.com/mpr/mpr';
  }

  /**
   * Class constructor
   */
  constructor() {}

  static get(endpoint, access_token, params) {
    return LinkedinClient._invoke('get', endpoint, access_token, params)
  }

  static post(endpoint, access_token, body) {
    return LinkedinClient._invoke('post', endpoint, access_token, body)
  }

  static delete(endpoint, access_token) {
    return LinkedinClient._invoke('delete', endpoint, access_token)
  }

  static _invoke(method, endpoint, access_token, data) {

    return new Promise((resolve, reject) => {

      const headers = {
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      }

      const version = (endpoint === '/media/upload') ? '' : '/v2'

      const url = `${LinkedinClient.baseUrl}${version}${endpoint
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')}`

      const options = {
        method,
        url,
        'qsStringifyOptions': {
          encoder: (str) => {
            return encodeURI(str).replace(/:/g, '%3A')
          }
        }
      }

      if (method === 'get') {
        options.qs = data
      }

      if (method === 'post' && endpoint !== '/media/upload') {
        options.body = JSON.stringify(data)
      }

      if (endpoint === '/media/upload') {
        options.formData = data
      }

      if (access_token) {
        options.auth = {
          'bearer': access_token
        }
      }

      options.headers = headers

      request(options, (error, response, body) => {

        if (error) {
          return reject(error)
        }

        if (response.statusCode === 404) {
          return resolve(null);
        }

        if (response.statusCode !== 200 && response.statusCode !== 201) {
          const err = `Error ${response.statusCode}: ${response.statusMessage},
             ${JSON.stringify(body)}`
          return reject(err);
        }

        try {
          if (method.toUpperCase() === 'POST' && endpoint === '/ugcPosts') {
            return resolve({ '$URN': response.headers['x-restli-id']})
          }

          const data = JSON.parse(body);
          return resolve(data);
        } catch (err) {
          return reject(err)
        }
      });
    })
  }

  static getIdFromURN(urn) {
    const chunks = urn.split(':')
    return chunks.slice(3)
  }

  static getCommentIdFromURN(urn) {
    const match = urn.match( /(\d+)\)$/)
    if (!match) {
      return null
    }
    return match[1]
  }

  static getObjectTypeFromURN(urn) {
    const chunks = urn.split(':')
    return chunks[2]
  }


  static getMediaUrl(urn) {
    return `${LinkedinClient.baseMediaUrl}${LinkedinClient.getIdFromURN(urn)}`
  }

};