public class Main {

    public void Iout(int text) {
        System.out.println(text);
    }

    public void Sout(String text) {
        System.out.println(text);
    }
    public static void main(String[] args) {
        multiplications multiplications = new multiplications();
        Main h = new Main();

        h.Iout(multiplications.firstidea(4, 6));

        h.Iout();
    }
}