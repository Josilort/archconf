public class Main {

    

    public void out(String text) {
        System.out.println(text);
    }
    public static void main(String[] args) {
        multiplications multiplications = new multiplications();
        Main h = new Main();

        h.out(String.valueOf(multiplications.firstidea(4, 6)));
    }
}