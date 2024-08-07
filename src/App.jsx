import styles from "./style"
import {About,
  //Button,
  Contact, 
  Footer,
  Hero,
  Services,
  Team,
  Info, 
  Navbar,
  Stats} from './components'


const App = () => (
    <div>
      <div className="bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className= {`${styles.boxWidth}`}>
            <Navbar/>
          </div>
        </div>

        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Hero/>
          </div>
        </div>

        <div className={`bg-primary ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Stats/>
            <Info/> 
            <About/>
            <Services/> 
            <Team/> 
            <Contact/>
            <Footer/>
          </div>
        </div>
      </div>
    </div>
  )

export default App
