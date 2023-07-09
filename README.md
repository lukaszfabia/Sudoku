# Sudoku
### Webowa gra logiczna. ###
****
**Zawartość gry:**

* trzy poziomy trudności

* skrypt z tutorialem

* porady jak skutecznie wypełniać pola

****
**Rozgrywka:**

Gracz wybiera poziom trudności, następnie generuje się plansza, po prawej stronie po zaznaczeniu pola na planszy, wybiera liczbe, którą chce wstawić. 


****
**Dodatki:**

* `timer` - odmierza czas ukończenia poziomu

* `remove` - usuwa wpisaną liczbę przez gracza

* `check` - sprawdzenie poprawności wypełnionch pól

* `pause` - zatrzymuje czas i zamazuje plansze

**Zakończenie:**

Gra kończy się po wypełnieniu wszystkich pól **poprawnie**, po zakończeniu wyświetla się alert z informacją o czasie ukończenia poziomu, po kliknięciu `ok`, skrypt przenosi do nowej gry, którą rozpoczynamy tak samo - poprzez wybranie poziomu trudności.

**Uwagi:**
* Gra nie posiada zapisu stanu gry, po odświeżeniu strony, gra rozpoczyna się od nowa.
* Gra nie posiada zapisu wyników, po odświeżeniu strony, wyniki są usuwane.
* Gra nie posiada możliwości wyboru poziomu trudności w trakcie gry.
* Opcje `remove`, `check`, `pause` są dostępne tylko w trakcie gry.
* Opcja `check` jest dostępna tylko raz w trakcie gry.
* Strona nie posiada jeszcze responsywności - co może powodować problemy z wyświetlaniem na przeglądarkach innych niż `Google Chrome` oraz na urządzeniach o innej rozdzielczości niż **1920x1080**, ale także przy dowolnej przeglądarce, która nie jest w **trybie pełnoekranowym**.
