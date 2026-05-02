import './Statistique.css';


function Statistique({ chiffre, label }) {
  return (
    <div className="stat">
      <h2>{chiffre}</h2>
      <p>{label}</p>
    </div>
  );
}

export default Statistique;