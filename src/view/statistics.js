import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Color } from '../utils/const.js';
import {
  getUniqueTypes,
  getCostsByType,
  getAmountOfPointsByType,
  getTimeSpentByType,
  getDataMap,
  getSortedMap } from '../utils/statistics.js';
import SmartView from './smart.js';
import { humanizeDurationFormat } from '../utils/point.js';

const BAR_HEIGHT = 55;
const FONT_SIZE = 13;
const LENGTH = 90;
const PADDING = 5;
const THICKNESS = 44;
const TITLE_FONT_SIZE = 23;

const moneyFormat = (val) => `€ ${val}`;
const typeFormat = (val) => `${val}x`;
const timeFormat = (val) => `${humanizeDurationFormat(val)}`;

const renderChart = (ctx, uniqueTypes, dataByTypes, format, title) => {
  ctx.height = BAR_HEIGHT * uniqueTypes.length;

  const dataMap = getDataMap(uniqueTypes, dataByTypes);
  const sortedMap = getSortedMap(dataMap);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedMap.keys()],
      datasets: [{
        data: [...sortedMap.values()],
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: FONT_SIZE,
          },
          color: Color.BLACK,
          anchor: 'end',
          align: 'start',
          formatter: format,
        },
      },
      title: {
        display: true,
        text: title,
        fontColor: Color.BLACK,
        fontSize: TITLE_FONT_SIZE,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: PADDING,
            fontSize: FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: LENGTH,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
            <h2 class="visually-hidden">Trip statistics</h2>
            <div class="statistics__item statistics__item--money">
              <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
            </div>
            <div class="statistics__item statistics__item--transport">
              <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
            </div>
            <div class="statistics__item statistics__item--time-spend">
              <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
            </div>
          </section>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._points = points;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    const uniqueTypes = getUniqueTypes(this._points);
    const moneyByType = getCostsByType(this._points, uniqueTypes);
    const amountByType = getAmountOfPointsByType(this._points, uniqueTypes);
    const timeByType = getTimeSpentByType(this._points, uniqueTypes);

    this._moneyChart = renderChart(moneyCtx, uniqueTypes, moneyByType, moneyFormat, 'MONEY');
    this._typeChart = renderChart(typeCtx, uniqueTypes, amountByType, typeFormat, 'TYPE');
    this._timeChart = renderChart(timeCtx, uniqueTypes, timeByType, timeFormat, 'TIME-SPENT');
  }
}
