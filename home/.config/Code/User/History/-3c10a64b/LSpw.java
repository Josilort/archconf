public class Main {

    public void out(String text) {
        if(text instanceof String) {
            System.out.println(text);
        } else {
            System.out.println(String.valueOf(text));
        }
        
        
    }
    public static void main(String[] args) {
        multiplications multiplications = new multiplications();

        out(multiplications.firstidea(4, 6));

        System.out
    }
}