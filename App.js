import { useState } from "react";
import { Calendar } from "react-native-calendars";
import { styles } from "./Calendar.style";
import { View } from "react-native";

function calculerCycle(dateRegles) {
  // Convertir la date des règles en objet de type Date
  const dateReglesObj = new Date(dateRegles);

  // Calculer la date approximative de l'ovulation
  const ovulation = new Date(
    dateReglesObj.getTime() + 14 * 24 * 60 * 60 * 1000
  );

  // Calculer la période de fécondité
  const debutFertilite = new Date(
    ovulation.getTime() - 4 * 24 * 60 * 60 * 1000
  );
  const finFertilite = new Date(ovulation.getTime() + 2 * 24 * 60 * 60 * 1000);

  // Calculer les dates des règles suivantes pour les 12 prochains mois
  const cycles = [];
  let currentDate = dateReglesObj;
  for (let i = 0; i < 12; i++) {
    cycles.push(currentDate.toISOString().split("T")[0]);
    currentDate = new Date(currentDate.getTime() + 28 * 24 * 60 * 60 * 1000);
  }

  return {
    ovulation: ovulation.toISOString().split("T")[0],
    debut_fertilite: debutFertilite.toISOString().split("T")[0],
    fin_fertilite: finFertilite.toISOString().split("T")[0],
    cycles: cycles,
    premier_jour_regles: dateReglesObj.toISOString().split("T")[0], // Ajout de la date du premier jour des règles
  };
}


export default function App() {
  const [selected, setSelected] = useState("");
  const [cycle, setCycle] = useState(null);

  const handlePressDay = (day) => {
    setSelected(day.dateString);
    const calculatedCycle = calculerCycle(day.dateString);
    setCycle(calculatedCycle); // Update the cycle state with the calculated cycle data
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.theme}
        onDayPress={handlePressDay}
        markingType={"period"}
        markedDates={{
          [selected]: {
            startingDay: true,
            color: "#FFADAD",
          },
          ...(cycle && {
            // Marquer les jours des règles #FFADAD
            ...cycle.cycles.reduce((marked, date) => {
              marked[date] = { startingDay: true, color: "#FFADAD" };
              marked[new Date(date).getTime() + 4 * 24 * 60 * 60 * 1000] = { color: "#FFADAD" };
              return marked;
            }, {}),
            // Marquer la période de fécondité en #E2445C
            [cycle.debut_fertilite]: {
              startingDay: true,
              color: "#E2445C",
            },
            [cycle.fin_fertilite]: {
              endingDay: true,
              color: "#E2445C",
            },
            // Marquer la date d'ovulation en #E2445C contour
            [cycle.ovulation]: {
              color: "#E2445C",
            },
            // Marquer les cinq premiers jours de règles en #FFADAD
            [cycle.premier_jour_regles]: {
              startingDay: true,
              color: "#FFADAD",
            },
            [new Date(cycle.premier_jour_regles).getTime() + 1 * 24 * 60 * 60 * 1000]: {
              color: "#FFADAD",
            },
            [new Date(cycle.premier_jour_regles).getTime() + 2 * 24 * 60 * 60 * 1000]: {
              color: "#FFADAD",
            },
            [new Date(cycle.premier_jour_regles).getTime() + 3 * 24 * 60 * 60 * 1000]: {
              color: "#FFADAD",
            },
            [new Date(cycle.premier_jour_regles).getTime() + 4 * 24 * 60 * 60 * 1000]: {
              color: "#FFADAD",
            },
          }),
        }}
        
      />
    </View>
  );
}
