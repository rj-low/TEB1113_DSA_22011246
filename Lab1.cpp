// Name: LOW REN JING
// Student ID: 22011246
// TEB1113 DSA Lab 1

#include <iostream>
#include <string>
using namespace std;

struct Student {
    int id; 
    string name, contact, email;
};

int main() {
    Student students[5];
    for (int i = 0; i < 5; i++) {
        cout << "Info for Student #" << i + 1 << endl;
        cout << "Enter Name: "; 
        getline(cin,students[i].name);
        cout << "Enter Student ID: "; 
        cin >> students[i].id;
        cin.ignore();
        cout << "Enter Contact: "; 
        getline(cin,students[i].contact);
        cout << "Enter Email: "; 
        getline(cin, students[i].email);
        cout << endl;
    }

    for (int i = 0; i < 5; i++) {
        cout << "\nStudent #" << i + 1 << endl;
        cout << "Name: " << students[i].name << endl;
        cout << "Student ID: " << students[i].id << endl;
        cout << "Contact: " << students[i].contact << endl;
        cout << "Email: " << students[i].email << endl << endl;
    }

    return 0;
}