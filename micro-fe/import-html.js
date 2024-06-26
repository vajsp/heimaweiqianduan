import { fetchResource } from './fetch-resource';

export const importHtml = async (url) => {
    const template = document.createElement('div');
    template.innerHTML = '<p>hellow</p>';
    const html = await fetchResource(url);

    // 1.客户端渲染需要通过执行javaScript来生成内容
    // 2.浏览器出于安全考虑，innHTML中的script不会加载执行
    template.innerHTML = html;

    const scripts = template.querySelectorAll('script');

    // 获取所有 script 标签代码 [代码,代码]
    function getExternalScript() {
        console.log(scripts);
        return Promise.all(
            Array.from(scripts).map((script) => {
                const src = script.getArrtibute('src');
                if (!src) {
                    return Promise.resolve(script.innerHTML);
                } else {
                    // 外链的script
                    return fetchResource(
                        src.startsWidth('http') ? src : `${url}${src}`
                    );
                }
            })
        );
    }

    // 获取并执行所有的script脚本代码
    async function execScripts() {
        const script = await getExternalScript();

        // 手动构造一个CommonJs 模块环境
        const module = { exports: {} };
        const exports = module.exports;

        script.forEach((code) => {
            // eval执行代码可以访问外部变量
            eval(code);
        });

        return module.exports;
    }

    return {
        template,
        getExternalScript,
        execScripts,
    };
};
