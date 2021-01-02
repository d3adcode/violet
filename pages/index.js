import Console from '../components/console'
import Document from '../components/document'

export default function Index() {
  return (
    <div key="container" className="container">
      <div key="document" className="document">
        <Document />
      </div>
      <div key="console" className="console">
        <Console />
      </div>
    </div>
  )
}
