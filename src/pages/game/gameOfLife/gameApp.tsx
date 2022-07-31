import React, { Component } from 'react';
import styles from './style/index.module.less';
import {
    Button,
    Space,
    Typography,
    Slider,
} from '@arco-design/web-react';

const totalBoardRows = 40;
const totalBoardColumns = 60;

const newBoardStatus = (cellStatus = () => Math.random() < 0.3) => {
    const grid = [];
    for (let r = 0; r < totalBoardRows; r++) {
        grid[r] = [];
        for (let c = 0; c < totalBoardColumns; c++) {
            grid[r][c] = cellStatus();
        }
    }
    return grid;
};

const BoardGrid = ({ boardStatus, onToggleCellStatus }) => {
    const handleClick = (r, c) => onToggleCellStatus(r, c);

    const tr = [];
    for (let r = 0; r < totalBoardRows; r++) {
        const td = [];
        for (let c = 0; c < totalBoardColumns; c++) {
            td.push(
                <td
                    key={`${r},${c}`}
                    className={boardStatus[r][c] ? styles.alive : styles.dead}
                    onClick={() => handleClick(r, c)}
                />
            );
        }
        tr.push(<tr key={r}>{td}</tr>);
    }
    return <table><tbody>{tr}</tbody></table>;
};

class GameApp extends Component {
    state = {
        boardStatus: newBoardStatus(),
        generation: 0,
        isGameRunning: false,
        speed: 500
    };

    timerID = null;

    runStopButton = () => {
        return this.state.isGameRunning ?
            <Button shape='round' type='primary' onClick={this.handleStop}>Stop</Button> :
            <Button shape='round' type='primary' onClick={this.handleRun}>Start</Button>;
    }

    handleClearBoard = () => {
        this.setState({
            boardStatus: newBoardStatus(() => false),
            generation: 0
        });
    }

    handleNewBoard = () => {
        this.setState({
            boardStatus: newBoardStatus(),
            generation: 0
        });
    }

    handleToggleCellStatus = (r, c) => {
        const toggleBoardStatus = prevState => {
            const clonedBoardStatus = JSON.parse(JSON.stringify(prevState.boardStatus));
            clonedBoardStatus[r][c] = !clonedBoardStatus[r][c];
            return clonedBoardStatus;
        };

        this.setState(prevState => ({
            boardStatus: toggleBoardStatus(prevState)
        }));
    }

    handleStep = () => {
        const nextStep = prevState => {
            const boardStatus = prevState.boardStatus;

            const clonedBoardStatus = JSON.parse(JSON.stringify(boardStatus));

            const amountTrueNeighbors = (r, c) => {
                const neighbors = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
                return neighbors.reduce((trueNeighbors, neighbor) => {
                    const x = r + neighbor[0];
                    const y = c + neighbor[1];
                    const isNeighborOnBoard = (x >= 0 && x < totalBoardRows && y >= 0 && y < totalBoardColumns);

                    if (trueNeighbors < 4 && isNeighborOnBoard && boardStatus[x][y]) {
                        return trueNeighbors + 1;
                    } else {
                        return trueNeighbors;
                    }
                }, 0);
            };

            for (let r = 0; r < totalBoardRows; r++) {
                for (let c = 0; c < totalBoardColumns; c++) {
                    const totalTrueNeighbors = amountTrueNeighbors(r, c);

                    if (!boardStatus[r][c]) {
                        if (totalTrueNeighbors === 3) clonedBoardStatus[r][c] = true;
                    } else {
                        if (totalTrueNeighbors < 2 || totalTrueNeighbors > 3) clonedBoardStatus[r][c] = false;
                    }
                }
            }

            return clonedBoardStatus;
        };

        this.setState((prevState: any) => ({
            boardStatus: nextStep(prevState),
            generation: prevState.generation + 1
        }));
    }

    handleSpeedChange = newSpeed => {
        console.log(newSpeed)
        this.setState({ speed: newSpeed });
    }

    handleRun = () => {
        this.setState({ isGameRunning: true });
    }

    handleStop = () => {
        this.setState({ isGameRunning: false });
    }

    componentDidUpdate(prevProps, prevState) {
        const { isGameRunning, speed } = this.state;
        const speedChanged = prevState.speed !== speed;
        const gameStarted = !prevState.isGameRunning && isGameRunning;
        const gameStopped = prevState.isGameRunning && !isGameRunning;

        if ((isGameRunning && speedChanged) || gameStopped) {
            clearInterval(this.timerID);
        }

        if ((isGameRunning && speedChanged) || gameStarted) {
            this.timerID = setInterval(() => {
                this.handleStep();
            }, speed);
        }
    }

    render() {
        const { boardStatus, isGameRunning, generation, speed } = this.state;

        return (
            <div className={styles.game}>
                <Typography.Title>Game of Life</Typography.Title>
                <BoardGrid boardStatus={boardStatus} onToggleCellStatus={this.handleToggleCellStatus} />
                <div>
                    <Typography.Paragraph>
                        {'+ '}
                        <Slider value={speed} style={{ width: 500 }} tooltipVisible min={50} max={1000} step={50} onChange={this.handleSpeedChange} />
                        {' -'}
                    </Typography.Paragraph>
                    <Typography.Paragraph>{`Generation: ${generation}`}</Typography.Paragraph>
                </div>
                <Space size='large'>
                    {this.runStopButton()}
                    <Button shape='round' type='primary' disabled={isGameRunning} onClick={this.handleStep}>Next Generation</Button>
                    <Button shape='round' type='primary' onClick={this.handleClearBoard}>Clear Board</Button>
                    <Button shape='round' type='primary' onClick={this.handleNewBoard}>Random Board</Button>
                </Space>
            </div>
        );
    }
}

export default GameApp;