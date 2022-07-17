import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Card,
    PaginationProps,
    Button,
    Typography,
} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import axios from 'axios';
import './mock'
import dayjs from 'dayjs';

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
                <Button
                    type="text"
                    size="small"
                >
                    {t['blogTable.columns.operations.view']}
                </Button>
            ),
        },
    ];
}

function BlogTable() {
    const t = useLocale(locale);

    const columns = getColumns(t)

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        setLoading(true);
        axios
            .get('/api/blogs', {
            })
            .then((res) => {
                setData(res.data.list);
                setLoading(false);
            });
    }


    return (<Card> <Title heading={6}>{t['menu.table.blogTable']}</Title> <Table rowKey="id" loading={loading} columns={columns} data={data}></Table> </Card>);
}

export default BlogTable;