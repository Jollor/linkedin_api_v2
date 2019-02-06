# A Simple LinkedIn client for API v2

##Example usage
```
const Client = require('../lib/LinkedinClient')

const access_token = '...'

const params = {
  q: 'roleAssignee',
  role: 'ADMINISTRATOR',
  state: 'APPROVED',
  projection: '(elements*(organizationalTarget~(localizedName,logo)))'
}

Client.get('/organizationalEntityAcls', access_token, params)

  .then(result => {
    console.log(result);
  })

  .catch(err => {
    console.log(err);
  })
```