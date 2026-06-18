window.addEventListener('DOMContentLoaded', () => {
  const backendOrigin = (window.location.origin === 'http://127.0.0.1:5500' || window.location.origin === 'http://localhost:5500')
    ? 'http://127.0.0.1:8000'
    : window.location.origin;

  function parseJsonResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    return response.text().then((text) => {
      throw new Error(text || 'Unexpected non-JSON response from server');
    });
  }

  const registerForm = document.getElementById('CreateAccount');
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const data = {
        username: formData.get('username'),
        password1: formData.get('password'),
        password2: formData.get('password'),
        email: formData.get('email'),
        phone_number: formData.get('phoneNumber'),
        role: formData.get('Role'),
      };

      try {
        const response = await fetch(`${backendOrigin}/register/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify(data),
        });

        const result = await parseJsonResponse(response);
        if (response.ok && result.redirect_url) {
          window.location.href = `${backendOrigin}${result.redirect_url}`;
          return;
        }
        if (result.errors) {
          alert('Errors: ' + JSON.stringify(result.errors));
        }
      } catch (error) {
        alert('Error submitting form: ' + error.message);
      }
    });
  }

  const loginForm = document.getElementById('first_form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const data = {
        username: formData.get('username'),
        password: formData.get('Password'),
      };

      try {
        const response = await fetch(`${backendOrigin}/login/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json().catch(() => null);
        if (response.ok && result && result.redirect_url) {
          window.location.href = `${backendOrigin}${result.redirect_url}`;
          return;
        }

        if (result && result.errors) {
          alert('Login failed: ' + JSON.stringify(result.errors));
        } else {
          alert('Login failed. Please check your username and password.');
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });
  }
});
