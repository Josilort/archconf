import imp.*;  // (World, Actor, GreenfootImage, Greenfoot und MouseInfo)
//import java.awt.Font;
import java.net.InetAddress;

/**
 * Datenauswertung: Zahlen werden aus CSV-Datei gelesen.
 * 
 * @author Schaller 
 * @version 27.09.2021
 */
public class DatenauswertungCSV 

{
    // Liste mit allen Werten 
    // Deklariere ein Array zahlen für die Punkte und ein Array namen für die Spielernamen
    //------------
    // TODO
    //------------

    String[] namen;
    int[] punkte;

    int bestepunkte;
    String sieger;

    String[] namenins;
    int[] punkteins;

    public String getOperatingSystem() {
        return System.getProperty("os.name");
    }

    public DatenauswertungCSV() {
        
        if (getOperatingSystem().equals("Linux")) {
        // CSV-Datei laden und anzeigen wenn in Linux
        ladeTabelle("/run/media/j/josia/Info/Workspace/java/Datenauswertung/k1April22.csv");
        } else {
        // CSV-Datei laden und anzeigen wenn in Windows
        ladeTabelle("F://Info//Workspace//java//Datenauswertung//k1April22.csv");
        }

        //ladeTabelle("Datenauswertung//k1April22.csv");

    }

    public void ladeTabelle(String name) {
        // Tabelle aus CSV-Datei laden
        Table csv = new Table(name,"header",';','"');

        namen = new String[csv.getRowCount()];

        punkte = new int[csv.getRowCount()];
        // Initialisiere Arrays, in die alle Zeilen der Tabelle passen
        // Die Anzahl der gespeicherten Zeilen bekommt man mit csv.getRowCount()
        //------------
        // TODO
        //------------

        for(int i = 0; i < namen.length; i++) {
            namen[i] = csv.getString(i, 0);
            punkte[i] = csv.getInt(i, 1);
        }

        // Fülle die Arrays mit Werten aus der Tabelle
        // Mit csv.getInt(zeilennummer, "Name der Spalte") oder csv.getInt(zeilennummer, spaltennummer)
        // bekommt man die Werte der Tabelleneinträge als Integer-Wert
        // Informiere dich unter https://processing.org/reference/Table.html, welche Methode geeignet ist,
        // um die Namen der Spieler als String zu bekommen. getInt hilft hier nicht weiter.
        //------------
        // TODO
        //------------  
    }

    public String gewinner() {
        for(int i = 0; i < namen.length; i++) {   

            if (punkte[i] > bestepunkte) {
                bestepunkte = punkte[i];
                sieger = namen[i];
            }
        }
        return sieger + " - " + bestepunkte;
    }

    public int summe() {
        int e = 0;
        for(int i = 0; i < punkte.length; i++) {
            e = e + punkte[i];
        }

        return e;
    }

    public int durchschnitt() {
        int e = 0;
        for(int i = 0; i < punkte.length; i++) {
            e = e + punkte[i];
        }
        return e / punkte.length;
    }

    public int mehrals1000() {
        int e = 0;
        for(int i = 0; i < punkte.length; i++) {
            if (punkte[i] > 1000) {
                e = e + 1;
            }
        }
        return e;
    }

    public int spielerpunkte(String name) {
        int e = 0;
        for(int i = 0; i < punkte.length; i++) {
            
            if (namen[i].equals(name)) {
                e = e + punkte[i];
            }
        }
        return e;
    }

    public int spieleranzahl(String name) {
        int e = 0;
        for(int i = 0; i < punkte.length; i++) {
            
            if (namen[i].equals(name)) {
                e = e + 1;
            }
        }
        return e;
    }

    // Read arrays
    //    for (int i = 0; i < array.lenght; i++) {System.out.println(array[i]);}
    
    public int gesamtanzahlspieler() {
        String name;
        int e = 0;
        int z = 0;
        int u = 0;

        String[] copy;
        String[] copy2;
        copy = new String[namen.length];
        copy2 = new String[namen.length];

        name = namen[0];
        for (int i = 0, j = 0; i < punkte.length; i++) {
            if (namen[i].equals(name)) {}
            else {copy[j++] = namen[i]; z++;}
        }
        e++;

        while (u > 0 || z > 0) {
            name = copy[0];
            for (int i = 0, j = 0; i <= z; i++) {
                if (copy[i] == null) {continue;}
                if (copy[i].equals(name)) {}
                else {copy2[j++] = copy[i]; u++;}
            }
            z = 0;
            e++;

            name = copy2[0];
            for (int i = 0, j = 0; i <= u; i++) {
                if (copy2[i] == null) {continue;}
                if (copy2[i].equals(name)) {}
                else {copy[j++] = copy2[i]; z++;}
            }
            u = 0;
            e++;
        }
        e--;

        return e;
    }

    //public int anzahl() {
    //    int anz = 0;
    //    for(int i=0; i<namen.length; i++){
    //        boolean neu = true;
    //        for(int j=i-1; j>=0; j--)
    //        {
    //            if(namen[i].equals(namen[j])) neu = false;
    //        }
    //        if(neu) anz++;
    //    }
    //    return anz;
    //}

    public void namenarrayinsgesamt() {
        String name;
        int z = 0;
        int u = 0;
        int v = 0;

        namenins = new String[gesamtanzahlspieler()];

        punkteins = new int[gesamtanzahlspieler()];

        String[] copy;
        String[] copy2;
        copy = new String[namen.length];
        copy2 = new String[namen.length];

        name = namen[0];
        if (v < gesamtanzahlspieler()) {namenins[v] = name;}
        for (int i = 0, j = 0; i < punkte.length; i++) {
            if (namen[i].equals(name)) {}
            else {copy[j++] = namen[i]; z++;}
        }
        v++;

        while (u > 0 || z > 0) {
            name = copy[0];
            if (v < gesamtanzahlspieler()) {namenins[v] = name;}
            for (int i = 0, j = 0; i <= z; i++) {
                if (copy[i] == null) {continue;}
                if (copy[i].equals(name)) {}
                else {copy2[j++] = copy[i]; u++;}
            }
            z = 0;
            v++;

            name = copy2[0];
            if (v < gesamtanzahlspieler()) {namenins[v] = name;}
            for (int i = 0, j = 0; i <= u; i++) {
                if (copy2[i] == null) {continue;}
                if (copy2[i].equals(name)) {}
                else {copy[j++] = copy2[i]; z++;}
            }
            u = 0;
            v++;
        }

        for(int i = 0; i < namenins.length; i++) {
            punkteins[i] = spielerpunkte(namenins[i]);
        }

        //for (int i = 0; i < namenins.length; i++) {System.out.println(namenins[i]);}
        //for (int i = 0; i < punkteins.length; i++) {System.out.println(punkteins[i]);}
    }

    public void tausche(int x, int y, int[] intarray, String[] stringarray) {
        
        if(intarray != null) {
            int intablage = 0;
            
            intablage = intarray[x];
            intarray[x] = intarray[y];
            intarray[y] = intablage;
        }

        if(stringarray != null) {
            String strablage = "";

            strablage = stringarray[x];
            stringarray[x] = stringarray[y];
            stringarray[y] = strablage;
        }
    }

    public void bubblesort() {
        for(int j = 0; j < punkteins.length - 1; j++) {
            for(int i = 0; i < punkteins.length - 1; i++) {
                if(punkteins[i] > punkteins[i + 1]) tausche(i, i + 1, punkteins, namenins);
            }
        }
    }

    public void selectionsort() {
        int stelle = 0;

        for(int i = 0, e = punkteins.length - 1; i < punkteins.length; i++, e--) {
            for(int s = 0, sophie = 0; s <= e; s++) {
                if(punkteins[s] > sophie) {
                    sophie = punkteins[s];
                    stelle = s;
                }   
            }
            tausche(stelle, e, punkteins, namenins);
        }
    }

    public void insertionsort() {
        for(int i = 1; i < punkteins.length; i++) {
            for(int e = 0; e < i; e ++) {
                if (punkteins[i] < punkteins[e]) {
                    tausche(i, e, punkteins, namenins);
                }
            }
        }
    
    }

    public static void main(String[] args) {

        DatenauswertungCSV datenauswertung = new DatenauswertungCSV();

        //System.out.println(datenauswertung.gewinner());

        //System.out.println(datenauswertung.summe());

        //System.out.println(datenauswertung.durchschnitt());

        //System.out.println(datenauswertung.mehrals1000());

        //System.out.println(datenauswertung.spielerpunkte("Josia"));

        //System.out.println("");

        datenauswertung.gesamtanzahlspieler();

        datenauswertung.namenarrayinsgesamt();

        for (int i = 0; i < datenauswertung.namenins.length; i++) {System.out.println(datenauswertung.namenins[i]);}
        for (int i = 0; i < datenauswertung.punkteins.length; i++) {System.out.println(datenauswertung.punkteins[i]);}

        System.out.println("");
        
        //datenauswertung.bubblesort();

        //System.out.println("");

        //datenauswertung.selectionsort();

        //System.out.println("");

        datenauswertung.insertionsort();

        for (int i = 0; i < datenauswertung.namenins.length; i++) {System.out.println(datenauswertung.namenins[i]);}
        for (int i = 0; i < datenauswertung.punkteins.length; i++) {System.out.println(datenauswertung.punkteins[i]);}

        System.out.println(InetAddress.getLocalHost());
    }
}
