import { Link } from 'react-router';

export const Page = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to='/devices'>Devices</Link>
      <Link to='/images'>Images</Link>
      <Link to='/workspace'>Workspace</Link>
    </div>
  )
}

export default Page;