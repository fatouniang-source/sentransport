import './App.css';

import { useState, useEffect } from 'react';

import Header from './Header';
import Footer from './Footer';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Carte from './Carte';

function App() {

  // =========================
  // Etats React
  // =========================

  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  const [nombreRecherches, setNombreRecherches] = useState(0);


  // =========================
  // Charger les lignes
  // =========================

  function chargerLignes() {

    setLigneSelectionnee(null);

    setChargement(true);

    setErreur(null);

    fetch("http://localhost:5000/lignes")

      .then(response => {

        if (!response.ok) {

          throw new Error(
            "Erreur serveur : " + response.status
          );
        }

        return response.json();
      })

      .then(data => {

        setLignes(data);

        setChargement(false);

      })

      .catch(error => {

        setErreur(error.message);

        setChargement(false);

      });
  }


  // =========================
  // Chargement initial
  // =========================

  useEffect(() => {

    chargerLignes();

  }, []);


  // =========================
  // Filtrer les lignes
  // =========================

  const lignesFiltrees = lignes.filter(ligne =>

    ligne.depart
      .toLowerCase()
      .includes(recherche.toLowerCase())

    ||

    ligne.arrivee
      .toLowerCase()
      .includes(recherche.toLowerCase())

    ||

    ligne.numero.includes(recherche)
  );


  // =========================
  // Clic ligne
  // =========================

  function handleClickLigne(ligne) {

    if (
      ligneSelectionnee &&
      ligneSelectionnee.id === ligne.id
    ) {

      setLigneSelectionnee(null);

      return;
    }

    fetch(
      `http://localhost:5000/lignes/${ligne.id}`
    )

      .then(response => {

        if (!response.ok) {

          throw new Error(
            "Impossible de charger les détails"
          );
        }

        return response.json();
      })

      .then(data => {

        setLigneSelectionnee(data);

      })

      .catch(error => {

        console.error(error);

      });
  }


  // =========================
  // Recherche
  // =========================

  function handleRecherche(texte) {

    setRecherche(texte);

    setNombreRecherches(
      prev => prev + 1
    );
  }


  // =========================
  // Chargement
  // =========================

  if (chargement) {

    return (

      <div className="App">

        <Header />

        <main className="contenu">

          <p className="message-chargement">
            Chargement des lignes...
          </p>

        </main>

      </div>
    );
  }


  // =========================
  // Erreur
  // =========================

  if (erreur) {

    return (

      <div className="App">

        <Header />

        <main className="contenu">

          <div className="message-erreur">

            <p>
              Impossible de charger les lignes.
            </p>

            <p className="erreur-detail">
              {erreur}
            </p>

            <p>
              Vérifiez que Flask est lancé.
            </p>

          </div>

        </main>

      </div>
    );
  }


  // =========================
  // JSX principal
  // =========================

  return (

    <div className="App">

      <Header />

      <main className="contenu">

        <p className="compteur-recherche">

          Vous avez effectué
          {' '}
          {nombreRecherches}
          {' '}
          recherche(s)

        </p>

        <Recherche

          valeur={recherche}

          onChange={handleRecherche}

          onEffacer={() => {

            setRecherche("");

            setNombreRecherches(
              prev => prev + 1
            );
          }}
        />

        <p className="resultat-recherche">

          {lignesFiltrees.length}
          {' '}
          ligne
          {lignesFiltrees.length > 1 ? 's' : ''}
          {' '}
          trouvée
          {lignesFiltrees.length > 1 ? 's' : ''}

        </p>

        {
          lignesFiltrees.length === 0 && (

            <p className="aucun-resultat">
              Aucune ligne trouvée
            </p>
          )
        }

        <button
          className="btn-recharger"
          onClick={chargerLignes}
        >
          Recharger
        </button>

        {
          lignesFiltrees.map(ligne => (

            <LigneBus
              key={ligne.id}

              numero={ligne.numero}

              depart={ligne.depart}

              arrivee={ligne.arrivee}

              arrets={ligne.arrets}

              estSelectionnee={
                ligneSelectionnee &&
                ligneSelectionnee.id === ligne.id
              }

              onClick={() =>
                handleClickLigne(ligne)
              }
            />
          ))
        }

        {
          ligneSelectionnee && (

            <DetailLigne
              ligne={ligneSelectionnee}
            />
          )
        }

        <div className="zone-carte">

          <Carte />

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default App;