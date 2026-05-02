import User from './User'

function Tableau({titre, tableau}) {
    const utilisateurs = [
        {nom : "NIANG", prenom : "FATOU"},
        {nom : "NIANG", prenom : "Aïda"},
    ]

    return(
        <div>
            <h1>Tableau {titre}</h1>
            {
                utilisateurs.map(({nom, prenom}, index) => (<User key={index} nom={nom} prenom={prenom}/>))
            }
            <User nom={"Niang"} prenom={"Fatou"}/>
        </div>
    )
}

export default Tableau;
