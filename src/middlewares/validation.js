function isEmpty(str) {
  if (!str || str.trim().length === 0 || str.length === 0) {
    return true;
  }

  return false;
}

function isLength(str, length) {
  if (!str || !length) {
    return;
  }

  if (!this.isEmpty(str)) {
    if (str.length >= Number(length)) {
      return true;
    }

    return false;
  }
}

function isEmail(email) {
  if (this.isEmpty(email)) {
    return false;
  }
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

function validateSignupData(body) {
  const { email, firstname, lastname, password } = body;

  let errors = {};

  errors.valid = false;

  if (this.isEmpty(firstname)) {
    errors.username = "lastname must not be empty";
  }

  if (this.isEmpty(lastname)) {
    errors.lastname = "lastname must not be empty";
  }

  if (!this.isEmail(email)) {
    errors.email = `${email} is not a valid email address`;
  }

  if (!this.isLength(password, 7)) {
    errors.password = "password length must be  7 chars or more";
  }

  if (errors.length > 1) {
    return JSON.parse(errors);
  }

  errors.valid = true;

  return errors;
}

function validateLoginData(body) {
  const { email, password } = body;

  let errors = {};

  errors.valid = false;

  if (!this.isEmail(email)) {
    errors.email = `${email} is not a valid email address`;
  }

  if (!this.isLength(password, 7)) {
    errors.password = "password length must be atleast  7 chars or more";
  }
  console.log(errors);

  if (errors.length > 1) {
    return JSON.parse(errors);
  }

  errors.valid = true;
  return errors;
}

module.exports = {
  validateSignupData,
  validateLoginData
};
