import { useState, useEffect } from 'react';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import './Carte.css';


// =========================
// Correction icônes Leaflet
// =========================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',

  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',

  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});


// =========================
// Fonction distance
// =========================

function calculerDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat =
    (lat2 - lat1) * Math.PI / 180;

  const dLon =
    (lon2 - lon1) * Math.PI / 180;

  const a =

    Math.sin(dLat / 2) *
    Math.sin(dLat / 2)

    +

    Math.cos(lat1 * Math.PI / 180) *

    Math.cos(lat2 * Math.PI / 180) *

    Math.sin(dLon / 2) *

    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return R * c;
}


// =========================
// Composant Carte
// =========================

function Carte() {

  const [arrets, setArrets] = useState([]);

  const [
    positionUtilisateur,
    setPositionUtilisateur
  ] = useState(null);

  const [
    arretProche,
    setArretProche
  ] = useState(null);

  const DAKAR = [14.6928, -17.4467];


// =========================
// Charger les arrêts
// =========================

  useEffect(() => {

    fetch("http://localhost:5000/arrets")

      .then(response => response.json())

      .then(data => {

        setArrets(data);

      })

      .catch(error => {

        console.error(
          "Erreur arrêts :",
          error
        );

      });

  }, []);


// =========================
// Géolocalisation
// =========================

  useEffect(() => {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(

        position => {

          setPositionUtilisateur([
            position.coords.latitude,
            position.coords.longitude
          ]);

        },

        () => {

          console.log(
            "Géolocalisation refusée"
          );

        }
      );
    }

  }, []);


// =========================
// Arrêt le plus proche
// =========================

  useEffect(() => {

    if (
      positionUtilisateur &&
      arrets.length > 0
    ) {

      let proche = null;

      let distanceMin = Infinity;

      arrets.forEach(arret => {

        const distance =
          calculerDistance(

            positionUtilisateur[0],
            positionUtilisateur[1],

            arret.lat,
            arret.lon
          );

        if (distance < distanceMin) {

          distanceMin = distance;

          proche = {
            ...arret,
            distance
          };
        }
      });

      setArretProche(proche);
    }

  }, [positionUtilisateur, arrets]);


// =========================
// JSX
// =========================

  return (

    <div className="carte-container">

      <h2 className="carte-titre">
        Carte des arrêts
      </h2>

      {
        arretProche && (

          <p className="arret-proche">

            Arrêt le plus proche :

            <strong>
              {' '}
              {arretProche.nom}
            </strong>

            {' '}
            (
            {arretProche.distance.toFixed(1)}
            {' '}km
            )

          </p>
        )
      }

      <MapContainer
        center={DAKAR}
        zoom={13}
        scrollWheelZoom={true}
        className="carte"
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

          attribution="&copy; OpenStreetMap"
        />

        {
          arrets.map(arret => (

            <Marker
              key={arret.id}

              position={[
                arret.lat,
                arret.lon
              ]}
            >

              <Popup>

                <strong>
                  {arret.nom}
                </strong>

                <br />

                Lignes :
                {' '}
                {arret.lignes.join(', ')}

              </Popup>

            </Marker>
          ))
        }

        {
          positionUtilisateur && (

            <Marker
              position={positionUtilisateur}
            >

              <Popup>
                Vous êtes ici
              </Popup>

            </Marker>
          )
        }

      </MapContainer>

    </div>
  );
}

export default Carte;