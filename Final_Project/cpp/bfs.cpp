#include <vector>
#include <queue>
#include <emscripten.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE
void bfs(int* grid, int rows, int cols, int startX, int startY, int endX, int endY, int* result) {
    std::fill(result, result + rows * cols, 0);

    std::queue<std::pair<int, int>> q;
    std::vector<std::vector<bool>> visited(rows, std::vector<bool>(cols, false));

    q.push({startX, startY});
    visited[startY][startX] = true;

    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        result[y * cols + x] = 1;

        if (x == endX && y == endY) return;

        int dx[] = {0, 1, 0, -1};
        int dy[] = {-1, 0, 1, 0};

        for (int i = 0; i < 4; ++i) {
            int nx = x + dx[i], ny = y + dy[i];
            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows &&
                !visited[ny][nx] && grid[ny * cols + nx] == 0) {
                visited[ny][nx] = true;
                q.push({nx, ny});
            }
        }
    }
}
}


