import urlJoin from 'url-join';


const Back = {
  base_api_url: 'http://127.0.0.1:5000',

  getToken: async () => {
    return JSON.parse(sessionStorage.getItem('token'))
  },

  makeRequest: async (method, url, data=null) => {
    const auth_token = await Back.getToken()
    let options = {
      method: method,
      mode: 'cors',
      cache: 'no-store',
      timeout: 120 * 1000,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    if (auth_token) {
      options.headers['Authorization'] = auth_token
    }
    if (data) {
      options.body = JSON.stringify(data)
    }
    const response = await fetch(urlJoin(Back.base_api_url, url), options);
    if (!response.ok) {
      sessionStorage.setItem('token', null)
    }
    return await response.json();
  },

  getUsers: async () => {
    return await Back.makeRequest('GET', '/user')
  },

  addUser: async (user_data) => {
    return await Back.makeRequest('POST', '/user', user_data)
  },
  getSubjects: async () => {
    return await Back.makeRequest('GET', '/subject')
  },

  addSubject: async (data) => {
    return await Back.makeRequest('POST', '/subject', data)
  },
  getJournal: async () => {
    return await Back.makeRequest('GET', '/journal')
  },

  addMark: async (data) => {
    return await Back.makeRequest('POST', '/journal', data)
  }
}

export default Back;