import React from 'react';
import {
    Card,
    Typography,
    Grid,
    Descriptions,
    Divider,
    Comment,
    Avatar,
    Space,
    List
} from '@arco-design/web-react';
import Mock from 'mockjs';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const Row = Grid.Row;
const Col = Grid.Col;

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
            content: 'React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable and easier to debug'
        },
    );

    return {
        props: {
            postData: data,
        },
    };
}

function BlogPost(props) {
    const blogInfo = [
        {
            label: 'Category',
            value: props.postData.category
        },
        {
            label: 'Created Time',
            value: dayjs().subtract(props.postData.createdTime, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
    ]

    const comments = [
        {
            id: '1',
            author: 'watermelon',
            avatar: 'data:image/jpeg;base64,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',
            content: 'Build encapsulated components that manage their own state, then compose them to make complex UIs. Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep state out of the DOM.'
        },
        {
            id: '2',
            author: 'apple',
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpnkpypfCvJB9XfXx_TRdXSBknyH0In0OE6BZsHrjb2WVHllc4yCliV71HM8jaI8saxiw&usqp=CAU',
            content: 'We don\'t make assumptions about the rest of your technology stack, so you can develop new features in React without rewriting existing code. React can also render on the server using Node and power mobile apps using React Native.'
        }
    ]

    return (
        <Space direction='vertical' size={16}>
            <Card>
                <Typography>
                    <Row justify='center' >
                        <Title heading={4}> {props.postData.title} </Title>
                    </Row>

                    <Descriptions colon=' :' layout='inline-horizontal' data={blogInfo} />

                    <Divider />

                    <Paragraph> {props.postData.content} </Paragraph>

                </Typography>
            </Card>
            <Card>
                <List bordered={false} header={<span>{comments.length} comments</span>}>
                    {
                        comments.map(item => {
                            return (
                                <List.Item key={item.id}>
                                    <Comment
                                        align='right'
                                        author={item.author}
                                        avatar={
                                            <Avatar>
                                                <img
                                                    alt='avatar'
                                                    src={item.avatar}
                                                />
                                            </Avatar>
                                        }
                                        content={
                                            <div>
                                                {item.content}
                                            </div>
                                        }
                                        datetime='1 hour'
                                    />
                                </List.Item>
                            )
                        })
                    }
                </List>


            </Card>
        </Space>

    );
}

export default BlogPost;