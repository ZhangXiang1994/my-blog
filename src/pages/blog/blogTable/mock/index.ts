import Mock from 'mockjs';
import qs from 'query-string';
import setupMock from '@/utils/setupMock';

const { list } = Mock.mock({
    'list|100': [
        {
            'id|+1': 100000000,
            title: /博客[0-9]{5}/,
            category: () =>
                Mock.Random.pick([
                    'Java',
                    'Javascript',
                    'Go',
                    'Python',
                    'Ruby'
                ]),
            'createdTime|1-60': 0,
        },
    ],
});

setupMock({
    setup: () => {
        Mock.mock(new RegExp('/api/blogs'), (params) => {
            const {
                page = 1,
                pageSize = 10,
            } = qs.parseUrl(params.url).query;
            const p = page as number;
            const ps = pageSize as number;

            const result = [...list];
            return {
                list: result.slice((p - 1) * ps, p * ps),
                total: result.length,
            };
        });
    },
});
