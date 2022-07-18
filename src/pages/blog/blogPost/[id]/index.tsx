import React from 'react';
import {
    Card,
    Typography,
} from '@arco-design/web-react';
import Mock from 'mockjs';

const { Title } = Typography;

export async function getServerSideProps({ params }) {
    //Mock js cannot intercept service call
    const data = Mock.mock(
        {
            id: params.id,
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
            content: 'blog content blog content blog content blog content blog content blog content'
        },
    );

    return {
        props: {
            postData: data,
        },
    };
}

function BlogPost(props) {
    return (<Card> <Typography> <Title heading={6}> {props.postData.title} </Title> </Typography> </Card>);
}

export default BlogPost;