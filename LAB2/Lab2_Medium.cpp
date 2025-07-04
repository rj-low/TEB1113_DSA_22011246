// Name: LOW REN JING
// Student ID: 22011246
// TEB1113 DSA Lab 2 (Medium)

#include <iostream>
using namespace std;

int numberOfPaths(int m, int n) {
    if (m == 1 || n == 1)
        return 1;
    
    return numberOfPaths(m - 1, n) + numberOfPaths(m, n - 1);
}

int main() {
    int m = 3;
    int n = 3;
    int res = numberOfPaths(m, n);
    cout << res << endl;
    return 0;
}