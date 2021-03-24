<template>
  <div class="plan-editor__wrapper">
    <div v-if="!loading" class="activity-editor">
      <v-text-field
      v-model="planName"
      outlined
      class="plan-editor__input"
      label="Name"/>

      <div class="plan-editor__cooldown-container mt-1">
        <div class="plan-editor__cooldown-row">
          <div class="plan-editor__cooldown-controls">
            <v-btn
            fab
            small
            elevation="0"
            color="#BDBDBD"
            :disabled="cooldownTime === 0"
            @click="cooldownTime--">
              <v-icon>
                mdi-chevron-left
              </v-icon>
            </v-btn>

            <div class="plan-editor__cooldown-input">
              <v-text-field
              :value="cooldownTime"
              @input="cooldownHandler"
              type="number"
              outlined
              label="Refresh after (days)"
              hideDetails
              :rules="inputRules">
                {{ cooldownTime }}
              </v-text-field>
            </div>

            <v-btn
            fab
            small
            elevation="0"
            color="#BDBDBD"
            @click="cooldownTime++">
              <v-icon>
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </div>
        </div>

        <div class="plan-editor__cooldown-row justify-center mt-2">
          <div class="plan-editor__cooldown-heading mb-1 text-center">
            <span> {{ refreshDateText }}</span>
          </div>
        </div>
      </div>

      <div
      v-if="showCreateButton"
      class="plan-editor__create-button__wrapper">
        <v-btn
        xLarge
        dark
        rounded
        width="100%"
        @click="createPlanHandler">
          {{ editMode ? 'Edit' : 'Create' }}
        </v-btn>
      </div>

      <v-menu offsetY>
        <template
        v-slot:activator="{ on, attrs }">
          <v-btn
          class="plan-editor__add-activity"
          outlined
          large
          width="100%"
          v-bind="attrs"
          v-on="on">
            Add activities
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
        </template>

        <div class="plan-editor__menu-content">
          <v-btn
          dark
          width="100%"
          color="#333333"
          @click="showActivityPopup = true">
            Add activity from library

            <v-icon>
              mdi-library-shelves
            </v-icon>
          </v-btn>

          <v-btn
          dark
          width="100%"
          color="#333333"
          @click="createNewActivityHandler">
            Create new

            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
      </v-menu>
    </div>

    <div v-else class="plan-editor__skeleton-wrapper">
      <v-skeleton-loader
      class="plan-editor__skeleton"
      type="card"
      maxWidth="768"/>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations, mapState } from 'vuex';
  import debounce from 'lodash/debounce';
  import dayjs from 'dayjs';

  export default {
    name: 'PlanEditor',
    props: {
      from: {
        type: String,
        default: '',
      },
    },
    async created() {
      if (this.$route.params.id) {
        this.editMode = true;

        if (this.from === 'list') {
          await this.updatePlan({ id: this.$route.params.id });
          await this.updatePlanActivities({ activities: this.plan.activities });
        }
      }
      this.cooldownTime = this.plan.cooldown;
      this.setShowRouterBackButton(true);
      this.loading = false;
    },
    beforeRouteLeave(to, from, next) {
      this.setShowRouterBackButton(false);
      next();
    },
    methods: {
      ...mapActions({
        updatePlan: 'planEditor/updatePlan',
        updatePlanActivities: 'planEditor/updatePlanActivities',
      }),
      ...mapMutations({
        setShowRouterBackButton: 'appState/setShowRouterBackButton',
        setPlanKey: 'planEditor/setPlanKey',
      }),
      cooldownHandler(value) {
        if (value <= 0) {
          this.cooldownTime = 0;
          return;
        }

        this.cooldownTime = +value;
      },
      createNewActivityHandler() {
        this.$router.push({ name: 'activity-editor-new', query: { planId: this.plan.id } });
      },
      createPlanHandler() {

      },
    },
    computed: {
      ...mapState('planEditor', ['plan', 'activities']),
      planName: {
        get() {
          return this.plan.name;
        },
        set: debounce(function set(value) {
          this.setPlanKey({ key: 'name', value });
        }, 300),
      },
      refreshDateText() {
        if (this.expirationDate > 0) {
          return `Will renew at ${dayjs(this.expirationDate).format('DD, MMMM')}`;
        }

        return 'No renew date';
      },
      showCreateButton() {
        return this.plan.name;
      },
    },
    data() {
      return {
        loading: true,
        editMode: false,
        cooldownTime: 0,
        expirationDate: 0,
        inputRules: [(v) => v >= 0],
        showActivityPopup: false,
      };
    },
    watch: {
      cooldownTime(value) {
        this.expirationDate = value ? new Date(new Date().setDate(new Date().getDate() + value)).setHours(0, 0, 0) : 0;
        this.setPlanKey({ key: 'cooldown_expiration_date', value: this.expirationDate });
        this.setPlanKey({ key: 'cooldown', value });
      },
    },
  };
</script>

<style lang="scss">
  .plan-editor__wrapper {
    display: flex;
    justify-content: center;
  }

  .activity-editor {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex-grow: 1;

    max-width: 768px;

    padding: 16px;

    @include between-children() {
      margin-bottom: 12px;
    }
  }

  .plan-editor__input {
    min-width: 288px !important;
    width: 100% !important;
  }

  .plan-editor__create-button__wrapper {
    display: flex;
    flex-direction: row;

    position: fixed;
    left: 50%;
    bottom: 16px;
    transform: translate(-50%, 0);

    width: 75vw;
    max-width: 768px;
  }

  .plan-editor__skeleton-wrapper {
    display: flex;
    justify-content: center;

    width: 100%;
    padding: 16px;
  }

  .plan-editor__skeleton {
    width: 100%;
  }
  .plan-editor__cooldown-container {
    display: flex;
    flex-direction: column;

    width: 100%;
  }

  .plan-editor__cooldown-heading {
    p {
      color: #333333;
    }
  }

  .plan-editor__cooldown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 288px;
    width: 100%;

    span {
      text-align: center;
    }
  }

  .plan-editor__cooldown-input {
    max-width: 288px;
    margin: 0 16px;
  }

  .plan-editor__cooldown-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .plan-editor__cooldown-value {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    text-align: center;

    background-color: #BDBDBD;

    span {
      font-size: 16px;
      color: white;
      line-height: 32px;
    }
  }

  .plan-editor__add-activity-container {
    width: 100%;
    height: 100%;;
    background-color: #333333;

    display: flex;
    flex-direction: column;
  }

  .plan-editor__add-activity {
    justify-content: space-between !important;
  }

  .plan-editor__menu-content {
    display: flex;
    flex-direction: column;
    padding: 8px;
    background-color: #333333;
    color: white;

    .v-menu__content {
      box-shadow: none;
    }

    .v-btn__content {
      justify-content: space-between;
    }
  }

</style>