# A Simple LinkedIn client for API v2

##Examples

###Get companies managed by connected user
```
const Client = require('linkedin-api-v2')

const params = {
  q: 'roleAssignee',
  role: 'ADMINISTRATOR',
  state: 'APPROVED',
  projection: '(elements*(organizationalTarget~(localizedName,logo)))'
}

Client.get('/organizationalEntityAcls', ACCESS_TOKEN, params)

  .then(result => {
    console.log(result);
  })

  .catch(err => {
    console.log(err);
  })
```

###Upload media
```
const Client = require('linkedin-api-v2')
const request = require('request')

Client.post('/media/upload', access_token, {
  fileupload: request.get(IMAGE_URL)
})
  .then(reponse => {
    console.log(response);
  })
```
