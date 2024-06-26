const { rewriteRouter } = './rewrite-router.js';
const { handleRouter } = './handle-router.js';
const _apps = [];

export const getApps = () => _apps;

export const registerMicroApps = function (apps) {
    console.log(apps);
    _apps = apps;
};

export const start = () => {
    // 微前端的运行原理
    // 1.监事路由
    rewriteRouter();
    // 初始执行匹配
    handleRouter();

    // 2.匹配子应用
    // 3.加载子应用
    // 4.渲染子应用
};
