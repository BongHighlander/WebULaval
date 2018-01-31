/* eslint-disable */
import * as Cookies from "js-cookie";
import * as secureApi from '@/secureApi';

const md5 = require('md5');

async function isValidSession() {
  let res = await secureApi.getTokenInfo(false);
  let good = res.good;
  return good;
}

//This works because emails are unique
export async function getUserIdFromEmail(email) {
  let users = await secureApi.getUsers(true);
  let userData = users.find(user => user.email === email);
  if (userData === undefined) {
    return null;
  }
  else {

    return userData.id;
  }
}

export async function verifyAuthWithRedirect(wantGoodToken) {
  let res = await secureApi.getTokenInfo(false);
  let goodSession = await res.good;
  if (wantGoodToken) {
    if (goodSession) {
      //do nothing
    }
    else {
      // reset to prevent api call. performance only.
      Cookies.set("Authorization", "");
      window.location = "/#/login"
    }
  }
  else {
    if (goodSession) {
      let theJson = await res.theJson;
      window.location = "/#/userpage/" + theJson.id;
    }
    else {
      // do nothing
    }
  }
}

export async function theLogin(email, password) {
  let res = await secureApi.login(email, password);
  let good = await res.good;
  if (!good) {
    console.log("Bad Login");
  }
  else {
    let theJson = await res.theJson;
    Cookies.set("Authorization", theJson.token);
    window.location.href = "/#/userpage/" + theJson.id;
  }
}

export function getGravatar(email, size) {
  return 'http://www.gravatar.com/avatar/' + md5(email) + '.jpg?s=' + size;
}
