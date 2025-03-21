
export function LogoutButton () {

  function handleLogout (){
    localStorage.removeItem('access_token');
    window.location.reload();
  }
    return (
      <button className="w-24 ml-0" onClick={handleLogout}>
        Logout
      </button>
    );
  }

export default LogoutButton;
