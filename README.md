##Install

###Mac OS X

**Preparation**

- Install XCode and download developer tools.
- Install Git.

**Install Ruby**

```
\curl -#L https://get.rvm.io | bash -s stable --ruby
rvm install 1.9.3
```

**Install Binaries**

```
sudo brew install nginx memcached amqp mongodb
```

**Install Syme**

```
git clone git@github.com:louismullie/syme.git
cd syme
bundle install
```

**Launch Syme**

```
rvm use 1.9.3
foreman start
```

**Deploy Syme**

```
cap deploy:setup
cap deploy
```