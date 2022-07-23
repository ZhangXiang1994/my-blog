import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Button,
    Typography,
    PaginationProps,
} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import axios from 'axios';
import './mock'
import dayjs from 'dayjs';
import Link from 'next/link';

const { Title } = Typography;

function getColumns(t) {
    return [
        {
            title: t['blogTable.columns.id'],
            dataIndex: 'id',
        },
        {
            title: t['blogTable.columns.title'],
            dataIndex: 'title',
        },
        {
            title: t['blogTable.columns.category'],
            dataIndex: 'category',
        },
        {
            title: t['blogTable.columns.createdTime'],
            dataIndex: 'createdTime',
            render: (x) => dayjs().subtract(x, 'days').format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: t['blogTable.columns.operations'],
            dataIndex: 'operation',
            headerCellStyle: { paddingLeft: '15px' },
            render: (_, record) => (
                <Link href={`/blog/blogPost/${record.id}`}>
                    <Button
                        type="text"
                        size="small"
                    >
                        {t['blogTable.columns.operations.view']}
                    </Button>
                </Link>
            ),
        },
    ];
}

function BlogTable() {
    const t = useLocale(locale);

    const columns = getColumns(t)

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pagination, setPatination] = useState<PaginationProps>({
        sizeCanChange: true,
        showTotal: true,
        pageSize: 10,
        current: 1,
        pageSizeChangeResetCurrent: true,
    });

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize]);

    function onChangeTable({ current, pageSize }) {
        setPatination({
            ...pagination,
            current,
            pageSize,
        });
    }

    function fetchData() {
        const { current, pageSize } = pagination;

        setLoading(true);
        axios
            .get('/api/blogs', {
                params: {
                    page: current,
                    pageSize,
                }
            })
            .then((res) => {
                setData(res.data.list);
                setPatination({
                    ...pagination,
                    current,
                    pageSize,
                    total: res.data.total,
                });
                setLoading(false);
            });
    }


    return (<Card> <Title heading={6}>{t['menu.table.blogTable']}</Title>
        <Table rowKey="id"
            loading={loading}
            columns={columns}
            pagination={pagination}
            onChange={onChangeTable}
            data={data} />
    </Card>);
}

export default BlogTable;