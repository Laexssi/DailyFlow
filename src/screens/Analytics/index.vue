<template>
  <div class="main-screen__content">
    <v-sheet height="64">
      <v-toolbar
      flat>
        <v-btn
        outlined
        class="mr-4"
        color="grey darken-2"
        @click="setToday">
          Today
        </v-btn>
        <v-btn
        fab
        text
        small
        color="grey darken-2"
        @click="prev">
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn
        fab
        text
        small
        color="grey darken-2"
        @click="next">
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer/>
        <v-menu
        bottom
        right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
            outlined
            color="grey darken-2"
            v-bind="attrs"
            v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>

    <div
    class="analytics__calendar-wrapper">
      <v-sheet height="480px">
        <v-calendar
        v-if="!loading"
        v-model="focus"
        ref="calendar"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :eventOverlapMode="mode"
        :eventOverlapThreshold="30"
        :eventColor="getEventColor"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="getEvents">
          <template
          v-if="type === 'day'"
          v-slot:event="{ event }">
            <PlanActivityCard
            :activityData="event"/>
          </template>
        </v-calendar>
      </v-sheet>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import PlanActivityCard from 'components/PlanActivityCard';

  export default {
    name: 'Analytics',
    components: {
      PlanActivityCard,
    },
    created() {
      Promise.all([this.updateActivityList(), this.updateLabelList()])
        .then(() => {
          this.loading = false;
        })
        .catch((e) => console.warn(e));
    },
    methods: {
      ...mapActions({
        updateActivityList: 'activityList/updateList',
        updateLabelList: 'labelList/updateList',
      }),
      getEventColor(event) {
        return event.color;
      },
      getEvents() {
        this.events = [];
        this.activityList.forEach((activity) => {
          const { name, labels } = activity;
          if (activity.complete_count) {
            activity.complete_dates.forEach((date) => {
              this.events.push({
                name,
                start: date,
                timed: false,
                color: this.labelList.find((label) => label.id === labels[0]?.id)?.color || this.colors[this.rnd(0, this.colors.length - 1)],
                ...activity,
              });
            });
          }
        });
      },
      viewDay({ date }) {
        this.focus = date;
        this.type = 'day';
      },
      setToday() {
        this.focus = '';
        this.type = 'day';
      },
      prev() {
        this.$refs.calendar.prev();
      },
      next() {
        this.$refs.calendar.next();
      },
      rnd(a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a;
      },
    },
    computed: {
      ...mapGetters({
        activityList: 'activityList/getList',
        labelList: 'labelList/getList',
      }),
    },
    data: () => ({
      loading: true,
      focus: '',
      type: 'month',
      types: ['month', 'week', 'day', '4day'],
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      weekdays: [
        { text: 'Sun - Sat', focus: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', focus: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', focus: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', focus: [1, 3, 5] },
      ],
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    }),
  };
</script>

<style lang="scss">
  .analytics__calendar-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .v-event {
    height: 100px !important;
    width: auto;
  }

  .v-calendar-daily__body {
    display: none !important;
    flex: 0 0 0 !important;
    height: 0;
    width: 0;
  }

  .v-calendar-daily__intervals-head {
    display: none;
    width: 0 !important;
  }
</style>
