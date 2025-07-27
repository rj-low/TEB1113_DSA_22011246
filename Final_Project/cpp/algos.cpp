#include <queue>
#include <stack>
#include <vector>
#include <emscripten.h>

using namespace std;

bool isValid(int x, int y, int rows, int cols) {
    return x >= 0 && y >= 0 && x < cols && y < rows;
}

int dx[] = {0, 0, -1, 1}; // directions: up, down, left, right
int dy[] = {-1, 1, 0, 0};

extern "C" {
EMSCRIPTEN_KEEPALIVE
int bfs(int* grid, int rows, int cols, int startX, int startY, int endX, int endY, int* result, int* animOrder) {
    for (int i = 0; i < rows * cols; ++i) {
        result[i] = 0;
    }

    std::queue<std::pair<int, int>> q;
    std::vector<std::vector<bool>> visited(rows, std::vector<bool>(cols, false));
    int animIndex = 0;

    q.push({startX, startY});
    visited[startY][startX] = true;

    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        int idx = y * cols + x;
        result[idx] = 1;
        animOrder[animIndex++] = idx;

        if (x == endX && y == endY) {
            result[idx] = 2;
            break;
        }

        for (int d = 0; d < 4; ++d) {
            int nx = x + dx[d], ny = y + dy[d];
            if (isValid(nx, ny, rows, cols) && !visited[ny][nx] && grid[ny * cols + nx] == 0) {
                q.push({nx, ny});
                visited[ny][nx] = true;
            }
        }
    }

    return animIndex; // total cells visited
}
}


extern "C" {
EMSCRIPTEN_KEEPALIVE
int dfs(int* grid, int rows, int cols, int startX, int startY, int endX, int endY, int* result, int* animOrder) {
    for (int i = 0; i < rows * cols; ++i) {
        result[i] = 0;
    }

    std::stack<std::pair<int, int>> st;
    std::vector<std::vector<bool>> visited(rows, std::vector<bool>(cols, false));
    int animIndex = 0;
    bool found = false;

    st.push({startX, startY});

    while (!st.empty() && !found) {
        auto [x, y] = st.top();
        st.pop();

        if (!isValid(x, y, rows, cols) || visited[y][x] || grid[y * cols + x] == 1) continue;

        visited[y][x] = true;
        int idx = y * cols + x;
        result[idx] = 1;
        animOrder[animIndex++] = idx;

        if (x == endX && y == endY) {
            result[idx] = 2;
            found = true;
            break;
        }

        // Push neighbors in reverse order so left/right get processed first (optional)
        for (int d = 3; d >= 0; --d) {
            int nx = x + dx[d], ny = y + dy[d];
            st.push({nx, ny});
        }
    }

    return animIndex;
}
}

