const Header: React.FC = () => {
  const token = localStorage.getItem("token");

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-white text-lg font-bold">
            SFKanban
          </a>
        </div>
        <div>
          {token ? (
            <>
              <a
                href="/login"
                onClick={() => localStorage.removeItem("token")}
                className="text-gray-300 hover:text-white mr-4"
              >
                Sign out
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="text-gray-300 hover:text-white mr-4">
                Sign In
              </a>
              <a href="/register" className="text-gray-300 hover:text-white">
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
