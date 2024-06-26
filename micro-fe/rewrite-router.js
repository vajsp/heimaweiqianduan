const { handleRouter } = './handle-router.js';

let prevRoute = ''; //上一个路由
let nextRoute = window.location.pathname; //下一个路由

export const getPrevRoute = () => prevRoute;
export const getNextRoute = () => nextRoute;

export const rewriteRouter = () => {
    // hash 路由 window.onhashchange
    // history 路由
    // history.go history.back history.forward  使用popstate事件
    window.addEventListener('popstate', () => {
        console.log(popstate);
        // popsate 触发时候，路由已经完成导航了
        prevRoute = nextRoute;
        nextRoute = window.location.pathname;

        handleRouter();
    });

    // pushState replaceSatate 需要通过函数重写的方式进行劫持
    const rawPushState = window.history.pushState;
    window.history.pushState = (...args) => {
        // 导航前
        prevRoute = window.location.pathname;
        rawPushState.apply(window.history, args);
        nextRoute = window.location.pathname;
        console.log('监视到pushState变化了');

        handleRouter();
    };

    const rawReplaceState = window.history.pushState;
    window.history.replaceState = (...args) => {
        prevRoute = window.location.pathname;
        rawReplaceState.apply(window.history, args);
        nextRoute = window.location.pathname;
        console.log('监视到pushState变化了');
        handleRouter();
    };
};
