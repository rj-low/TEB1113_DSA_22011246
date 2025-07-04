// Name: LOW REN JING
// Student ID: 22011246
// TEB1113 DSA Lab 2 (Hard)

#include <iostream>
using namespace std;

int win[8][3] = {{0, 1, 2},
                {3, 4, 5},
                {6, 7, 8},
                {0, 3, 6}, 
                {1, 4, 7}, 
                {2, 5, 8}, 
                {0, 4, 8}, 
                {2, 4, 6}};


bool isCWin(char *board, char c) {
    for (int i=0; i<8; i++)
        if (board[win[i][0]] == c &&
            board[win[i][1]] == c &&
            board[win[i][2]] == c )
            return true;
    return false;
}


bool isValid(char board[9]) {
    int xCount=0, oCount=0;

    for (int i=0; i<9; i++) {
        if (board[i]=='X') xCount++;
        if (board[i]=='O') oCount++;
    }

    if (xCount==oCount || xCount==oCount+1) {
        if (isCWin(board, 'O')) {
            if (isCWin(board, 'X'))
                return false;
            return (xCount == oCount);
        }

        if (isCWin(board, 'X') && xCount != oCount + 1)
        return false; 

        return true;
    }
    return false;
}

int main() {
    char board[] = {'X', 'X', 'O',
                    'O', 'O', 'X',
                    'X', 'O', 'X'};
    (isValid(board))? cout << "Given board is valid":
                        cout << "Given board is not valid";
    return 0;
}