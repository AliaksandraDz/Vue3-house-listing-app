<template>
  <div class="backdrop">
    <div class="modal">
      <h3>Delete listing</h3>
      <p>Are you sure you want to delete this listing?</p>
      <p class="modal-second-p">This action cannot be undone.</p>

      <router-link to="/">
        <button
          class="modal-delete"
          @click="handleDelete"
        >
          Yes, delete
        </button>
      </router-link>

      <button
        class="modal-back"
        @click="emitClose"
      >
        Go back
      </button>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/store'

export default {
  props: {
    house: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],

  setup(props, { emit }) {
    const store = useStore()

    const handleDelete = () => {
      store.deleteHouse(props.house.id)
      emit('close')
    }

    const emitClose = () => {
      emit('close')
    }

    return {
      handleDelete,
      emitClose
    }
  }
}
</script>

<style>

  .modal {
    width: 600px;
    padding: 40px 50px;
    background: var(--white);
    border-radius: 10px;
  
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin: 10px;
  }
  .modal h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    padding-bottom: 20px;
  }
  .modal p {
    text-align: center;
    color: var(--dark-grey);
    line-height: 1.5;
  }
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal button,
  .modal a {
    width: 350px;
    padding: 12px 0;
    border-radius: 7px;
    font-size: 16px;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    color: var(--white);
  }
  .modal-delete {
    background-color: var(--red);
  }
  .modal-back {
    background-color: var(--dark-grey);
  }
  .modal-second-p {
    margin-top: -17px;
    padding-bottom: 20px;
  }

  /* Small devices */
  @media (max-width: 768px) {
    .modal button,
    .modal a {
      width: 250px;
    }
  }

</style>
  