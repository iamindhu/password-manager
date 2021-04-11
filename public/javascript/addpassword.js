const apform = document.getElementById('addpasswordform');
// const passwod_category = document.getElementById('password_category');
// const username = document.getElementById('username');
// const password_hint = document.getElementById('password_hint');
// const password = document.getElementById('password');


apform.addEventListener('submit', async(e) =>{
    const password_category = apform.password_category.value;
    const username_a = apform.username.value;
    const password_hint = apform.password_hint.value;
    const password_a = apform.password.value;

    try {
        const res = await fetch('/addpassword', { 
          method: 'POST', 
          body: JSON.stringify({ password_category, username_a, password_hint, password_a}),
          headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();
        console.log(data);
        if (data.errors) {
        }
        if (data.user) {
          console.log('successful')
        }
      }
      catch (err) {
        console.log(err);
      }
});