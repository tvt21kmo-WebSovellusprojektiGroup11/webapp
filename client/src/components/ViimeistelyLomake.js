import KarryItem from "./KarryItem";

export default function ViimeistelyLomake(props) {
    return (
        <div className="restaurantItem">
            <div><h3>Tilauksesi viimeistely:</h3></div>
            <form onSubmit={props.onTilausClick}>
                anna toimitusaika:
                <input name="Toimitusaika" type="text"></input>
                varmistathan tilauksesi sisällön tästä:
                {props.karrynSisalto.map(t => <KarryItem key={t.idTuote} Nimi={t.Nimi} Kuva={t.Kuva} Hinta={t.Hinta} Kategoria={t.Kategoria} Kuvaus={t.Kuvaus} />)}
                <button type="submit">Tilaa</button>
            </form>
        </div>
    );
}
