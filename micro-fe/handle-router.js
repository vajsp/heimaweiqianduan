import { getApps } from '.';
import { importHtml } from './import-html';
import { getNextRoute, getPrevRoute } from './rewrite-router';

/**
 * 处理路由变化
 */
export const handleRouter = async () => {
    const apps = getApps();

    // 卸载上一个应用
    const prevApp = apps.find((item) => {
        return getPrevRoute().startsWith(item.activeRule);
    });

    // 如果有上一个应用，则先销毁
    if (prevApp) {
        await unmount(prevApp);
    }

    // 加载下一个应用
    console.log('handleRouter');
    // 2.匹配子应用
    console.log(window.location.pathname);
    // 2.1 获取到当前路由的路径

    const app = apps.find((item) => {
        return getNextRoute().startsWith(item.activeRule);
    });

    console.log(app);

    if (!app) {
        return;
    }

    // 2.2 去apps 里面查找
    const { template, getExternalScript, execScripts } = await importHtml(
        app.entry
    );
    const container = document.querySelector(app.container);
    container.appendChild(template);

    // 配置全局环境变量
    window.__POWERED_BY_QIANKUN__ = true;
    window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry;
    const appExports = await execScripts();
    console.log(appExports);

    app.bootstrap = appExports.bootstrap;
    app.mount = appExports.mount;
    app.unmount = appExports.unmount;

    await bootstrap(app);

    await mount(app);

    // 3.加载子应用
    // 4.渲染子应用
};

async function bootstrap(app) {
    app.bootstrap && (await app.bootstrap());
}

async function mount(app) {
    app.mount &&
        (await app.mount({
            container: document.querySelector(app.container),
        }));
}

async function unmount(app) {
    app.unmount &&
        (await app.unmount({
            container: document.querySelector(app.container),
        }));
}
