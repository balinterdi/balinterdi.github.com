---
layout: post
title: "MongoDB Tidbits"
date: 2011-09-27 09:36
comments: true
categories:
---

* When running a new query for the first time, the query optimizer will
  try several ways to find the fastest one. So to get a meaningful
  result about the running time, you have to run it at least a second
  time (obviously, the more you run it, the more precise the result will
  be)
