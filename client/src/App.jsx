import { useState } from 'react'
import './App.css'
import SignUp from './components/SignUp.jsx'
import Login from './components/Login.jsx'
import JoinGame from './components/JoinGame.jsx'
import {StreamChat} from 'stream-chat'
import {Chat} from 'stream-chat-react'
import Cookies from 'universal-cookie'

function App() {
  const cookies = new Cookies()
  const api_key = "ha9g99wf5pna"
  const token = cookies.get("token")
  const client = StreamChat.getInstance(api_key)
  const [isAuth, setIsAuth] = useState(false)

  const logOut = () => {
    cookies.remove("token")
    cookies.remove("userId")
    cookies.remove("firstName")
    cookies.remove("lastName")
    cookies.remove("username")
    cookies.remove("hashedPassword")
    client.disconnectUser()
    setIsAuth(false)
  }

  if(token){
    client.connectUser({
      id: cookies.get("userId"),
      name: cookies.get("username"),
      firstName: cookies.get("firstName"),
      lastName: cookies.get("lastName"),
      hashedPassword: cookies.get("hashedPassword")
    }, token
    ).then((user) => {
      setIsAuth(true)
    })
  }

  return <div className="App">
    {isAuth ? (
      <Chat client={client}>
        <JoinGame />
        <button onClick={logOut}>Log Out</button>
      </Chat>
    ) : (
      <>
        <SignUp setIsAuth={setIsAuth}/>
        <Login setIsAuth={setIsAuth}/>
      </>
    )}

  </div>
}

export default App
