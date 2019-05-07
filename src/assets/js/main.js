let render_config = {
    'position_x': 300,
    'position_y': 0,
    'panorama': 'img/panorama_30.jpg',
    'container_id': 'panorama_render',
    'turning': false,
    'arrows_show': true
};

let renders = {
    'meters_30': {
        'position_x': 300,
        'position_y': 0,
        'panorama': 'img/panorama_30.jpg',
        'container_id': 'panorama_render',
        'turning': false,
        'arrows_show': true
    },
    'meters_50': {
        'position_x': 310,
        'position_y': -10,
        'panorama': 'img/panorama_50.jpg',
        'container_id': 'panorama_render',
        'turning': false,
        'arrows_show': true
    },
    'meters_70': {
        'position_x': 170,
        'position_y': -20,
        'panorama': 'img/panorama_70.jpg',
        'container_id': 'panorama_render',
        'turning': false,
        'arrows_show': true
    },
    'meters_90': {
        'position_x': 250,
        'position_y': -30,
        'panorama': 'img/panorama_90.jpg',
        'container_id': 'panorama_render',
        'turning': false,
        'arrows_show': true
    },
    'meters_110': {
        'position_x': 180,
        'position_y': -25,
        'panorama': 'img/panorama_110.jpg',
        'container_id': 'panorama_render',
        'turning': false,
        'arrows_show': true
    },
};

let renders_list = Object.keys(renders);

starting_render(render_config);

function starting_render(render_config) {
    let manualControl = false,
        longitude = render_config.position_x,
        latitude = render_config.position_y,
        left_start = false,
        right_start = false,
        up_start = false,
        down_start = false,
        savedX,
        savedY,
        savedLongitude,
        savedLatitude,
        render_container;

    // Фон для панормы на случай если их на одном рендере будет несколько
    let panoramasArray = ["panorama.jpg"],
        panoramaNumber = Math.floor(Math.random() * panoramasArray.length);

    render_container = document.getElementById(render_config.container_id);

    //стартовые настройки рендера
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(render_container.offsetWidth, render_container.offsetHeight);
    render_container.appendChild(renderer.domElement);

    let scene = new THREE.Scene(),                                                                        // новая сцена
        camera = new THREE.PerspectiveCamera(75, render_container.offsetWidth / render_container.offsetHeight, 1, 1000),         // добавление камеры
        sphere = new THREE.SphereGeometry(100, 100, 40),                                                   // создание сферы для панорамы
        sphereMaterial = new THREE.MeshBasicMaterial(),                                                            // определение текстуры
        sphereMesh = new THREE.Mesh(sphere, sphereMaterial);                                                   //привязка текстуры к сфере


    camera.target = new THREE.Vector3(0, 0, 0);                                 //постановка камеры
    sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));                //преобразование сферы в большой пустой шар
    sphereMaterial.map = THREE.ImageUtils.loadTexture(render_config.panorama);  //загрузка текстуры

    //добавление сферы
    scene.add(sphereMesh);

    if (render_config.arrows_show) {
        //создание элементов управления
        let buttons_wrapper = document.createElement('div'),
            left_control = document.createElement('button'),
            right_control = document.createElement('button'),
            up_control = document.createElement('button'),
            down_control = document.createElement('button'),
            buttons_altitude = document.createElement('div'),
            button_30   = document.createElement('button'),
            button_50   = document.createElement('button'),
            button_70   = document.createElement('button'),
            button_90   = document.createElement('button'),
            button_110   = document.createElement('button'),
            buttons_wrapper_id,
            buttons_altitude_id;

        //блок, где лежат кнопки
        buttons_wrapper.setAttribute('id', 'buttons_wrapper');
        buttons_wrapper.setAttribute('class', 'panorama-btn-wrapper');
        render_container.appendChild(buttons_wrapper);
        buttons_wrapper_id = document.getElementById('buttons_wrapper');

        //блок, где лежат кнопки высоты
        buttons_altitude.setAttribute('id', 'buttons_altitude');
        buttons_altitude.setAttribute('class', 'panorama-btn-altitude');
        render_container.appendChild(buttons_altitude);
        buttons_altitude_id = document.getElementById('buttons_altitude');

        //левая кнопка
        left_control.setAttribute('id', 'left_control');
        left_control.setAttribute('class', 'panorama-btn panorama-btn--left');
        left_control.innerHTML = 'Вертеть влево';
        buttons_wrapper_id.appendChild(left_control);

        right_control.setAttribute('class', 'panorama-btn panorama-btn--right');
        //правая кнопка
        right_control.setAttribute('id', 'right_control');
        right_control.innerHTML = 'Вертеть вправо';
        buttons_wrapper_id.appendChild(right_control);

        //верхняя кнопка
        up_control.setAttribute('id', 'up_control');
        up_control.setAttribute('class', 'panorama-btn panorama-btn--up');
        up_control.innerHTML = 'Вертеть вврех';
        buttons_wrapper_id.appendChild(up_control);

        //нижняя кнопка
        down_control.setAttribute('id', 'down_control');
        down_control.setAttribute('class', 'panorama-btn panorama-btn--down');
        down_control.innerHTML = 'Вертеть вниз';
        buttons_wrapper_id.appendChild(down_control);

        //кнопки высоты
        //30 метров
        button_30.setAttribute('id', 'button_30');
        button_30.setAttribute('class', 'panorama-altitude-btn');
        button_30.setAttribute('data-keyrender', '0');
        button_30.innerHTML = '30';
        buttons_altitude_id.appendChild(button_30);
        //50 метров
        button_50.setAttribute('id', 'button_50');
        button_50.setAttribute('class', 'panorama-altitude-btn');
        button_50.setAttribute('data-keyrender', '1');
        button_50.innerHTML = '50';
        buttons_altitude_id.appendChild(button_50);
        //70 метров
        button_70.setAttribute('id', 'button_70');
        button_70.setAttribute('class', 'panorama-altitude-btn');
        button_70.setAttribute('data-keyrender', '2');
        button_70.innerHTML = '70';
        buttons_altitude_id.appendChild(button_70);
        //90 метров
        button_90.setAttribute('id', 'button_90');
        button_90.setAttribute('class', 'panorama-altitude-btn');
        button_90.setAttribute('data-keyrender', '3');
        button_90.innerHTML = '90';
        buttons_altitude_id.appendChild(button_90);
        //110 метров
        button_110.setAttribute('id', 'button_110');
        button_110.setAttribute('class', 'panorama-altitude-btn');
        button_110.setAttribute('data-keyrender', '4');
        button_110.innerHTML = '110';
        buttons_altitude_id.appendChild(button_110);

        //навешивание для кнопкоф
        document.getElementById('left_control').addEventListener('mousedown', onLeftControlStart, false);
        document.getElementById('left_control').addEventListener('mouseup', onLeftControlStop, false);
        document.getElementById('right_control').addEventListener('mousedown', onRightControlStart, false);
        document.getElementById('right_control').addEventListener('mouseup', onRightControlStop, false);
        document.getElementById('up_control').addEventListener('mousedown', onUpControlStart, false);
        document.getElementById('up_control').addEventListener('mouseup', onUpControlStop, false);
        document.getElementById('down_control').addEventListener('mousedown', onDownControlStart, false);
        document.getElementById('down_control').addEventListener('mouseup', onDownControlStop, false);

        //смена панормы
        document.getElementById('button_30').addEventListener('click', changePanorama, false);
        document.getElementById('button_50').addEventListener('click', changePanorama, false);
        document.getElementById('button_70').addEventListener('click', changePanorama, false);
        document.getElementById('button_90').addEventListener('click', changePanorama, false);
        document.getElementById('button_110').addEventListener('click', changePanorama, false);
    }


    //навешивание мышиных функций на мышиные собития
    let render_canvas = render_container.getElementsByTagName('canvas')[0];

    render_canvas.addEventListener("mousedown", onDocumentMouseDown, false);
    render_canvas.addEventListener("mousemove", onDocumentMouseMove, false);
    render_canvas.addEventListener("mouseup", onDocumentMouseUp, false);

    //для touch устройств
    render_canvas.addEventListener('touchstart', onDocumentMouseDown, false);
    render_canvas.addEventListener('touchmove', onDocumentMouseMove, false);
    render_canvas.addEventListener('touchend', onDocumentMouseUp, false);

    //обновление размеров холста
    window.addEventListener('resize', onWindowResize, false);
    //и создал я мир, и увидел я что это хорошо
    render();

    function render() {

        requestAnimationFrame(render);

        //раскоментировать, что бы включить вращение
        if (render_config.turning) {
            if (!manualControl) {
                longitude += 0.1;
            }
        }

        if (left_start) {
            longitude -= .5;
        }

        if (right_start) {
            longitude += .5;
        }

        if (up_start) {
            latitude += .5;
        }

        if (down_start) {
            latitude -= .5;
        }

        // лимит вращения по вертикали в градусах -85 до 85, что бы небо не оказалось под ногами
        latitude = Math.max(-85, Math.min(85, latitude));

        // обновление координат при движении камеры latitude (вертикальный модификатор) и longitude (горизонтальный модификатор)
        camera.target.x = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.cos(THREE.Math.degToRad(longitude));
        camera.target.y = 500 * Math.cos(THREE.Math.degToRad(90 - latitude));
        camera.target.z = 500 * Math.sin(THREE.Math.degToRad(90 - latitude)) * Math.sin(THREE.Math.degToRad(longitude));
        camera.lookAt(camera.target);

        // вызов перерисовки рендера, при вращении
        renderer.render(scene, camera);

    }

    //двигай влево
    function onLeftControlStart() {
        left_start = true;
    }

    function onLeftControlStop() {
        left_start = false;
    }

    //двигай вправо
    function onRightControlStart() {
        right_start = true;
    }

    function onRightControlStop() {
        right_start = false;
    }

    //двигай вверх
    function onUpControlStart() {
        up_start = true;
    }

    function onUpControlStop() {
        up_start = false;
    }

    //двигай вниз
    function onDownControlStart() {
        down_start = true;
    }

    function onDownControlStop() {
        down_start = false;
    }

    function onDocumentMouseDown(event) {

        event.preventDefault();

        manualControl = true;

        savedX = event.clientX;
        savedY = event.clientY;

        savedLongitude = longitude;
        savedLatitude = latitude;

    }

    function onDocumentMouseMove(event) {

        if (manualControl) {
            longitude = (savedX - event.clientX) * 0.1 + savedLongitude;
            latitude = (event.clientY - savedY) * 0.1 + savedLatitude;
        }

    }

    function onDocumentMouseUp(event) {

        manualControl = false;

    }

    function onWindowResize() {

        camera.aspect = render_container.offsetWidth / render_container.offsetHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(render_container.offsetWidth, render_container.offsetHeight);

    }

    //функция смены панорамы
    function changePanorama() {

        let this_render = this.dataset.keyrender,
            this_panorama;

        this_panorama = renders[renders_list[this_render]];
        sphereMaterial.map = THREE.ImageUtils.loadTexture(this_panorama.panorama);
        longitude = this_panorama.position_x;
        latitude = this_panorama.position_y;
    }
}