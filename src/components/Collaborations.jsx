import { clients } from "../constants";
import styles from "../style";

const Collaborations = () => (
  <section id="collaborations" className={`${styles.flexCenter} my-4`}>
    <div className={`w-full ${styles.gridContainer} flex flex-wrap gap-4`}>
      {clients.map((client) => (
        <div key={client.id} className={`flex-1 ${styles.flexCenter} min-w-[120px]`}>
          <img src={client.logo} alt="client" className="w-[100px] sm:w-[192px] object-contain" />
        </div>
      ))}
    </div>
  </section>
);

export default Collaborations;
