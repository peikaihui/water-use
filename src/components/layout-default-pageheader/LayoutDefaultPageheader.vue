<template>
  <div v-if="title || breadcrumbRoutes.length" class="w-layout-default-pageheader">
    <a-breadcrumb
      v-if="breadcrumbRoutes.length"
      class="w-layout-default-pageheader-breadcrumb"
      :routes="breadcrumbRoutes"
    >
      <template #itemRender="{ route }">
        {{ route.title }}
      </template>
    </a-breadcrumb>
    <h2
      v-if="title"
      class="w-layout-default-pageheader-title"
      :class="{
        ['w-layout-default-pageheader-title-only']: !breadcrumbRoutes.length
      }"
    >
      <ArrowLeftOutlined
        v-show="headerStatusGoBack"
        @click="headerGoBack"
      />
      <span
        class="w-layout-default-pageheader-title-inner"
        :class="{
          ['w-layout-default-pageheader-title-inner-only']: !headerStatusGoBack
        }"
      >{{ title }}</span>
    </h2>
  </div>
</template>

<script lang="ts" src="./layout-default-pageheader.ts"></script>
<style lang="scss" src="./layout-default-pageheader.scss"></style>
