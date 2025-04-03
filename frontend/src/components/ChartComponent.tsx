import { AreaSeries, createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export const ChartComponent = props => {
    const {
        data,
        tokenImages = {},
        colors: {
            backgroundColor = 'black',
            lineColor = '#2962FF',
            textColor = 'white',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(
        () => {
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            };

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                grid: {
                    vertLines: {
                        visible: false,
                    },
                    horzLines: {
                        visible: false,
                    },
                },
                width: chartContainerRef.current.clientWidth,
                height: 300,
            });
            chart.timeScale().fitContent();

            const newSeries = chart.addSeries(AreaSeries, { lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
            newSeries.setData(data);

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        },
        [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
    );

    return (
        <div
            ref={chartContainerRef}
            style={{ 
                paddingTop: '160px',
                position: 'relative'
            }}
        >
            {tokenImages.selling && (
                <img 
                    src={tokenImages.selling} 
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        zIndex: 10
                    }}
                />
            )}
            {tokenImages.buying && (
                <img 
                    src={tokenImages.buying} 
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '30px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        zIndex: 10
                    }}
                />
            )}
        </div>
    );
};

const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
];

export function App(props) {
    return (
        <ChartComponent {...props} data={initialData}></ChartComponent>
    );
}