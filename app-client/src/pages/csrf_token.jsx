import React from 'react';
import { Cookies } from 'react-cookies';

const csrftoken = Cookies.get('session');

const CSRFToken = () => {
  return <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />;
};
export default CSRFToken;
